const redis = require('redis')
const client = redis.createClient()

const Set = (key, value) => new Promise((resolve, reject) => client.set(key, value, (err, res) => err ?
    reject(err) : resolve(res)))
const Get = key => new Promise((resolve, reject) => client.get(key, (err, res) => err ? reject(err) : resolve(res)))
const Has = key => new Promise((resolve, reject) => client.exists(key, (err, res) => err ? reject(err) : resolve(res)))

module.exports = {
    Get,
    Set,
    Has
}