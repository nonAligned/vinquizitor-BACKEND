const Variety = require('../models/Variety');
const mongoose = require('mongoose');


const getAll = async (req, res) => {
    let limit = req.query?.limit || 10;

    try {
        const varieties = await Variety.find(
            {
                styles: {$regex: req.query?.filter || ""},
                $or: [
                    {name: {$regex: req.query?.searchString || "", $options: "i"}},
                    {alt_names: {$regex: req.query?.searchString || "", $options: "i"}}
                ]
            })
        .sort(sortHandler(req.query.sort))
        .limit(limit)
        .skip(req.query?.page * limit);

        if(!varieties) throw Error ('No data for varieties found in database');

        res.status(200).json({results: varieties, itemsFound: varieties.length});
    } catch (err) {
        res.status(400).json({message: err})
    }
}

const getById = async (req, res) => {
    try {
        const variety = await Variety.findById(req.params.id);
        if(!variety) throw Error (`No variety with id: ${req.params.id} found in database`);

        res.status(200).json(variety);
    } catch (err) {
        res.status(400).json({message: err})
    }
}

const createNew = async (req, res) => {
    const variety = new Variety({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        alt_names: req.body.alt_names,
        description: req.body.description,
        subtitle: req.body.subtitle,
        caption: req.body.caption,
        body: req.body.body,
        alcohol: req.body.alcohol,
        sweetness: req.body.sweetness,
        tannin: req.body.tannin,
        acidity: req.body.acidity,
        regional_varieties_ids: req.body.regional_varieties_ids,
        food_pairing: req.body.food_pairing,
        serving_temperature: req.body.serving_temperature,
        price_range: req.body.price_range,
        photo: req.file.path,
        decant: req.body.decant,
        flavors: req.body.flavors,
        glass_serving: req.body.glass_serving,
        cellar_storage: req.body.cellar_storage,
        rarity: req.body.rarity,
        area: req.body.area,
        top_producers: req.body.top_producers,
        styles: req.body.styles
    });

    try {
        const savedVariety = await variety.save();
        if(!savedVariety) throw Error('Something went wrong while saving the variety in database');

        res.status(200).json(savedVariety);
    } catch(err) {
        res.status(400).json({message: err});
    }
}

const deleteById = async (req, res) => {
    try {
        const removedVariety = await Variety.findByIdAndDelete(req.params.id);
        if(!removedVariety) throw Error (`No variety with id: ${req.params.id} found in database`);

        res.status(200).json(removedVariety);
    } catch (err) {
        res.status(400).json({message: err})
    }
}

const updateById = async (req, res) => {
    try {
        const updatedVariety = await Variety.findByIdAndUpdate(req.params.id, req.body);
        if(!updatedVariety) throw Error('Something went wrong while updating the variety');

        res.status(200).json(updatedVariety);
    } catch (err) {
        res.status(400).json({message: err});
    }
}

// GET route for returning one random variety from database
const getRandomVariety = async (req, res) => {
    try {
        const numberOfVarieties = await Variety.countDocuments();
        if(isNaN(numberOfVarieties)) throw new Error('Something went wrong when calcuating number of documents in database');
        if(numberOfVarieties === 0) throw new Error('No variety documents in the database');

        let randomNumber = Math.floor(Math.random() * numberOfVarieties);

        const variety = await Variety.findOne().skip(randomNumber);

        res.status(200).json(variety);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
}

//POST route for finding top 3 matches for parameteres set by request
const findMatchingVarieties = async (req, res) => {

    //Paramteres set by client
    const clientProperties = [
        req.body.body,
        req.body.alcohol,
        req.body.tannin,
        req.body.sweetness,
        req.body.acidity
    ];

    //Initializing array for returning top 3 matches
    let responseData = [];

    let bestMatch = {
        variety: {},
        matchPercentage: -1,
        type:""
    }
    let secondBestMatch = {
        variety: {},
        matchPercentage: -1,
        type:""
    }
    let thirdBestMatch = {
        variety: {},
        matchPercentage: -1,
        type:""
    }

    try {
        const varieties = await Variety.find();
        if(!varieties) throw new Error ('No data for varieties found in database');
        
        //Searching for matches through all available varieties in DB
        for (let i = 0; i < varieties.length; i++) {
            let currentVariety = varieties[i];
            let varietyProperties = [
                currentVariety.body,
                currentVariety.alcohol,
                currentVariety.tannin,
                currentVariety.sweetness,
                currentVariety.acidity
            ];
            
            let currentMatch = -1;

            currentMatch = calculateSimilarity(clientProperties, varietyProperties, 1, 5);

            if (currentMatch !== -1) {
                if (currentMatch > bestMatch.matchPercentage) {

                    thirdBestMatch.variety = secondBestMatch.variety;
                    thirdBestMatch.matchPercentage = secondBestMatch.matchPercentage;
                    thirdBestMatch.type = secondBestMatch.type;

                    secondBestMatch.variety = bestMatch.variety;
                    secondBestMatch.matchPercentage = bestMatch.matchPercentage;
                    secondBestMatch.type = bestMatch.type;

                    bestMatch.matchPercentage = currentMatch;
                    bestMatch.variety = currentVariety;
                    if (currentMatch >= 90) {
                        bestMatch.type = 'excellent';
                    } else if (currentMatch >= 60) {
                        bestMatch.type = 'good';
                    } else if (currentMatch >= 30){
                        bestMatch.type = 'loose';
                    } else {
                        bestMatch.type = 'bad';
                    }
                } else if (currentMatch > secondBestMatch.matchPercentage) {

                    thirdBestMatch.variety = secondBestMatch.variety;
                    thirdBestMatch.matchPercentage = secondBestMatch.matchPercentage;
                    thirdBestMatch.type = secondBestMatch.type;

                    secondBestMatch.matchPercentage = currentMatch;
                    secondBestMatch.variety = currentVariety;
                    if (currentMatch >= 90) {
                        secondBestMatch.type = 'excellent';
                    } else if (currentMatch >= 60) {
                        secondBestMatch.type = 'good';
                    } else if (currentMatch >= 30) {
                        secondBestMatch.type = 'loose';
                    } else {
                        secondBestMatch.type = "bad";
                    }
                } else if (currentMatch > thirdBestMatch.matchPercentage) {

                    thirdBestMatch.matchPercentage = currentMatch;
                    thirdBestMatch.variety = currentVariety;
                    if (currentMatch >= 90) {
                        thirdBestMatch.type = 'excellent';
                    } else if (currentMatch >= 60) {
                        thirdBestMatch.type = 'good';
                    } else if (currentMatch >= 30) {
                        thirdBestMatch.type = 'loose';
                    } else {
                        thirdBestMatch.type = "bad";
                    }
                }
            } else {
                continue;
            }
        }

        //PUSHING THE MATCHES TO RESPONSE ARRAY AND SETTING THEIR TYPE BASED ON THE MATCH VALUE
        if (bestMatch.matchPercentage !== -1) {
            responseData.push({
                varietyName: bestMatch.variety.name,
                varietyId: bestMatch.variety._id,
                matchPercentage: bestMatch.matchPercentage,
                type: bestMatch.type
            });
        }
        if (secondBestMatch.matchPercentage !== -1) {
            responseData.push({
                varietyName: secondBestMatch.variety.name,
                varietyId: secondBestMatch.variety._id,
                matchPercentage: secondBestMatch.matchPercentage,
                type: secondBestMatch.type
            });
        }
        if (thirdBestMatch.matchPercentage !== -1) {
            responseData.push({
                varietyName: thirdBestMatch.variety.name,
                varietyId: thirdBestMatch.variety._id,
                matchPercentage: thirdBestMatch.matchPercentage,
                type: thirdBestMatch.type
            });
        }

        res.status(200).json({results: responseData});
    } catch (err) {
        res.status(400).json({message: err})
    }
}
//SIMILARITY CALCULATION
function calculateSimilarity(userProperties, varietyProperties, minValue, maxValue) {
    let similarityPercentage;
    let maxDiff = maxValue - minValue;

    similarityPercentage = Math.pow((calculateMD(userProperties, varietyProperties, maxDiff) * calculateRMSD(userProperties, varietyProperties, maxDiff)), 1/2);

    if (isNaN(similarityPercentage)) {
        return -1;
    } else {
        return Math.ceil(similarityPercentage);
    }
}

//Function for calculation Euclidean distance
function calculateEuclid(userWine, dbWine) {
    let eucl;
    let sum = 0;
    
    for (let i=0; i<dbWine.length; i++) {
        sum += Math.pow(dbWine[i] - userWine[i], 2);
    }

    eucl = Math.sqrt(sum);
  
    return eucl;
}

//Function for calculating Root-mean-square-deviation
function calculateRMSD(userWine, dbWine, maxDiff) {
    let rmsd;
    let eucl = calculateEuclid(userWine, dbWine);
    
    rmsd = eucl / (Math.sqrt(dbWine.length) * maxDiff);
    
    return (1 - rmsd) * 100;
}

//Function for calculating Manhattan distance (percentage)
function calculateMD(userWine, dbWine, maxDiff) {
    let mnhtn = 0;
    
    for (let i=0; i<dbWine.length; i++) {
        mnhtn += Math.abs(dbWine[i] - userWine[i]);
    }
    
    return (1 - mnhtn / (dbWine.length * maxDiff)) * 100;
}

function sortHandler(query) {
    try {
        const toJSONString = ("{" + query + "}").replace(/(\w+:)|(\w+ :)/g, (matched => {
            return '"' + matched.substring(0, matched.length - 1) + '":';
        }));

        return JSON.parse(toJSONString);
    } catch(err){
        return JSON.parse("{}");
    }
}

module.exports = {
    getAll,
    getById,
    createNew,
    deleteById,
    updateById,
    findMatchingVarieties,
    getRandomVariety
}