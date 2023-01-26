console.log("Analytics");

// Initialize variables
let items = info.items
let purchases = info.purchases
let weathers = info.weathers

// Compare functions
function mostPurchased(a,b) {
    return a.soldCount - b.soldCount
}

function mostFav(a,b) {
    return a.favouriteCount - b.favouriteCount
}

function createdAt(a,b) {
    return a.createdAt - b.createdAt
}

// Functions
function getItem(id,array) {
    return array.find(item => {
        return item._id == id
    })
}

// Stats
let mostPurchasedItem = [...items].sort(mostPurchased)
mostPurchasedItem.reverse()
let mostFavItem = [...items].sort(mostFav)
mostFavItem.reverse()
let grossSales = 0
let netSales = 0
let statsByItem = []

items.forEach(item => {
    
    let grossSale = item.soldCount*item.price
    let netSale = item.soldCount*(item.price-item.oriPrice)

    let itemStat = {
        item: item,
        gross: grossSale,
        net: netSale
    }

    grossSales = grossSales + grossSale
    netSales = netSales + netSale
    statsByItem.push(itemStat)

});

// Purchases data processing
purchases.sort(createdAt)
let completed = 0
let pastDays = 10
let startDate, endDate
let label = []
let gross = []

purchases.forEach((purchase,index) => {

    if (purchase.status == 'completed') completed++

    if (index == 1) startDate = purchase.createdAt
    if (purchases.length - 1 == index) endDate = purchase.createdAt
    
    purchase.checkout.forEach(cart => {
        let item = getItem(cart.item,items)
        cart.item = item
    })
});

for (let i = 0; i < pastDays; i++) {
    
    let date = new Date(endDate)
    date.setDate(date.getDate() - i)

    let dateString = date.toLocaleDateString()

    label.push(dateString)
    gross.push(0)

    dayPurchases = purchases.filter(purchase => {
        let purchaseDate = new Date(purchase.createdAt)

        let yearCompare = date.getFullYear() == purchaseDate.getFullYear()
        let monthCompare = date.getMonth() == purchaseDate.getMonth()
        let dayCompare = date.getDate() == purchaseDate.getDate()
        let result = yearCompare && monthCompare && dayCompare

        return result
    })

    dayPurchases.forEach(purchase => {
        purchase.checkout.forEach(cart => {
            
            let item = cart.item
            let currentGross = item.price * cart.itemCount
            gross[i] = gross[i] + currentGross 

        });
    });

}

label.reverse()
gross.reverse()

// Plot Graph
var ctx2 = document.getElementById("chart-line").getContext("2d");

new Chart('chart-line', {
    type: "bar",
    data: {
        labels: label,
        datasets: [{
          data: gross,
          backgroundColor: 'orange'
        }]
    },
    options: {
        legend: {display: false},
        title: {
        display: true,
        text: "Gross Sales (RM)",
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                grid: {
                    drawBorder: false,
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: false,
                    borderDash: [5, 5]
                },
                ticks: {
                    display: true,
                    padding: 10,
                    color: '#b2b9bf',
                    font: {
                    size: 11,
                    family: "Open Sans",
                    style: 'normal',
                    lineHeight: 2
                    },
                },
                type: 'linear',
                display: true,
                position: 'left',
            },
        },
    },
});

document.getElementById('totalGross').innerHTML = 'Total Gross Sales: RM ' + grossSales
document.getElementById('totalNet').innerHTML = 'Total Net Sales: RM ' + netSales
document.getElementById('completed').innerHTML = 'Total completed order: ' + completed
document.getElementById('mostPurchased').innerHTML = 'Most Purchased Item: ' + mostPurchasedItem[0].name
document.getElementById('mostFav').innerHTML = 'Most Favourited Item: ' + mostFavItem[0].name


let ongoing = purchases.filter(purchase => purchase.status == 'in progress')
if (ongoing.length > 0) {
    document.getElementById('status').innerHTML = 'Pending order: ' + ongoing.length
} else {
    document.getElementById('status').innerHTML = 'Pending order: none'
}

// // MQTT ===============================================================
// const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);

// const host = 'ws://167.71.221.222:8883'

// console.log('Connecting mqtt client')
// const client = mqtt.connect(host, {
//     username: "GDGrocer",
//     password: "GDGrocer",
//     clientId: clientId,
//     protocolId: 'MQTT',
//     protocolVersion: 4,
//     clean: true,
//     reconnectPeriod: 1000,
//     connectTimeout: 30 * 1000,
// })

// client.on('error', (err) => {
//   console.log('Connection error: ', err)
//   client.end()
// })

// client.on('reconnect', () => {
//   console.log('Reconnecting...')
// })

// // Received
// client.on('message', (topic, message, packet) => {

//     // console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)

//     // Robot status
//     if (topic.includes('packaging/queue')) {
//         let parsedMessage = JSON.parse(message.toString())
//         console.log(parsedMessage);
//         if (parsedMessage.length == 0) {
//             document.getElementById('status').innerHTML = 'Packging status: done'
//             return
//         }
//         document.getElementById('status').innerHTML = 'Packging status: ' + parsedMessage[0].status
//     }

// })

// function subscribe() {
//     // Subscribe
//     client.subscribe('packaging/queue', { qos: 0 })
    
// }

// client.on('connect', () => {
//     console.log('Client connected:' + clientId)
//     subscribe();
// })

// function unsubscribe() {
//     // Unsubscribe
//     client.unsubscribe('testtopic', () => {
//         console.log('Unsubscribed')
//     })
// }

// function publish() {
//     // Publish
//     client.publish('testtopic', 'ws connection demo...!', { qos: 0, retain: false })
// }