const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');
const topic = require("./topics.json")
// const fs = require('fs');

const websites = [
    'https://www.w3schools.com/js/',
    // 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'
];

// const variables = [];


async function extractLinks(website) {
    try {
        const response = await axios.get(website);
        const $ = cheerio.load(response.data);

        // Modify the below line to extract the specific links you want from each website
        const links = [];
        $('a[href]').each((index, element) => {
            const path = $(element).attr('href')

            if (website.includes("w3schools")) {
                links.push(website + path)
            }

            if (website.includes("developer.mozilla.org")) {
                links.push(`https://developer.mozilla.org` + path)
            }

        });

        return links;

    } catch (error) {
        console.error(`Error fetching URL: ${website}\n`, error);
        return [];
    }
}



function topicsMatch(links, topic) {
    try {

        const linksArray = [];

        links.forEach(
            (urlPath) => {
                if (urlPath.includes(topic)) {
                    linksArray.push(urlPath)
                }
            }
        )

        return linksArray;

    } catch (error) {
        console.error(`Error fetching linksArray for topic - ${topic}:`, error);
        return [];
    }
}


(async () => {

    const topics = topic;

    let allLinks = [];

    for (const website of websites) {
        const links = await extractLinks(website);
        allLinks = allLinks.concat(links);
    }

    // Remove duplicates
    allLinks = [...new Set(allLinks)];

    for (const topic of Object.keys(topics)) {

        const { keywords } = topics[topic]

        let match = [];
        const matchingLinks = topicsMatch(allLinks, topic);
        match.push(...matchingLinks)

        // for (const keyword of keywords) {
        // const matchingLinks = topicsMatch(allLinks, keyword);
        // match.push(...matchingLinks)
        // }

        topics[topic]["pages"] = [...new Set(match)];

    }

    console.log(topics)


    // Save the links to a file
    // fs.writeFileSync('javascript_resources.txt', allLinks.join('\n') bnm,nbvc);
})();
