const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

async function getPriceFeed(){
    try{
        const siteURL = 'https://coinmarketcap.com/'

        const {data} = await axios({
            method: 'GET',
            url: siteURL,
        })

        const $ = cheerio.load(data)
        const elmSelector = '.h7vnx2-2 > tbody:nth-child(3) > tr'
        
        const keys = [
            'rank',
            'name',
            'price',
            '24h',
            '7d',
            'marketCap',
            'volume',
            'circulatingSupply'
        ]
        const coinArr = []
        
        $(elmSelector).each((parentIdx, parentElem) => {
            let keyIdx = 0
            const coinObj = {}
            if(parentIdx <= 9){
            $(parentElem).children().each((childIdx, childElem) =>{
                let tdValue = $(childElem).text()

                if(keyIdx === 1 || keyIdx === 6){
                    tdValue = $('p:first-child',$(childElem).html()).text()
                        
                }

                if(tdValue){
                    coinObj[keys[keyIdx]] = tdValue
                    keyIdx++
                }
            })
            coinArr.push(coinObj)
            } //this { is for the if
        })
        return coinArr
    } catch(err){
        console.log(err)
    }
}



const app = express()

app.get('/api/price-feed', async (req,res) => {
    try{
        const priceFeed = await getPriceFeed()

        return res.status(200).json({
            dataresult: priceFeed,
        })
    }
    catch(err){
        return res.status(500).json({
            err: err.toString(),
        })
    }
})


app.listen(3000, () => {
    console.log("running on port 3000")
})
