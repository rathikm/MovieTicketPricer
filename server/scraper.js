const axios = require('axios')
const request = require('request-promise-native')
const cheerio = require('cheerio')
const ob = require('./index') 

const fetchPrices = async (movie_name) => {
    try {
        let user_ip = ob.ip.ipAddress
        let options = {
            url: 'https://www.atomtickets.com/',
            headers: {
                'X-Forwarded-For': user_ip
              }
        }
        
        //let response = await axios.get('https://www.atomtickets.com/')
        let html = await request(options)
        let $ = cheerio.load(html)
        let movies = []
        let movie_objects_list = []
        //let async_queue = []
        $('a.anchor-block').each((index, el) => {
            const movie = $(el)
            const name = movie.attr('href')
            if (name.includes(movie_name)) {
                movies.push(name)
            }
        })
        //currently assuming only one movie is found
        let movie_link = movies[0]
        options = {
            url: 'https://www.atomtickets.com' + movie_link,
            headers: {
                'X-Forwarded-For': user_ip
              }
        }
        //goes to link of showtimes for movie
        html = await request(options)
        let $$ = cheerio.load(html)
        let el_arr_showtimes = []
        
        $$("div.showtime-panel").each((index, el) => {
            el_arr_showtimes.push(el)
        })
        let count = 0
        console.log(el_arr_showtimes.length)
        for (const el of el_arr_showtimes) {
            let details = {}
            const show_el = $$(el)
            details.formatted_time_price_list  = []
            details.theater = show_el.find('h2.venue-header__title a').text().trim()
            details.addy  = show_el.find('div.venue-header__address').text().trim()
            let showtimes = []
            show_el.find('div.format-showtimes.clearfix').each((index, el) => {
                showtimes.push(el)
            })
            for (const el of showtimes) {
                const format_el = $$(el)
                let formatted_time_price_obj = {}
                formatted_time_price_obj.time_prices_combos = []
                let format = format_el.find('.primary-attribute-text').text().trim()
                if (format.length == 0) {
                    format = show_el.find('img.format-icon').attr('alt')
                } 
                formatted_time_price_obj.format = format
                const showtimes = format_el.find('a.btn.btn-showtime.btn-block')
                let checkout_links = []
                showtimes.each((index,el) => {
                    const time_price_el = $$(el)
                    checkout_links.push('https://www.atomtickets.com' + time_price_el.attr('href'))
                })
                for (const link of checkout_links) {
                    let response_3 = ""
                    let checkout_html = ""
                    try {
                        console.log(link)
                        options = {
                            url: link,
                            headers: {
                                'X-Forwarded-For': user_ip
                              }
                        }
                        checkout_html = await request(options)
                    } catch (err) {
                        console.error(err)
                        continue
                    }

                    const $$$ = cheerio.load(checkout_html)
                    let combo = {}
                    combo.prices = []
                    $$$('div.price').each((index, el) => {
                        const p = $$$(el)
                        if (p.text() != "Price") {
                            combo.prices.push(p.text())
                        }

                    })
                    let done = false
                    const ticket_content = $$$('div.movie-summary.hidden-xs.clearfix')
                    ticket_content.each((index, el) => {
                        const t = $$$(el)
                        if (!done) {
                            done = true
                            combo.time = t.find('[data-qa=CheckoutMovieSummary_Time]').text().trim().replace('Today at ', '')
                            console.log(combo.time)
                        }
                    })
                    formatted_time_price_obj.time_prices_combos.push(combo)
                }
                details.formatted_time_price_list.push(formatted_time_price_obj)
                
            }
    
            
            if (count == 0) {
                //console.log(JSON.stringify(details))
                count = 1
            }
            
            movie_objects_list.push(details)
           
        }
        return movie_objects_list
        
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    fetchPrices
}