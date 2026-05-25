const createOption = (query, crypto = '') => {
  return {
    crypto: query.crypto || crypto || '',
    cookie: query.cookie || process.env.NETEASE_COOKIE,
    ua: query.ua || '',
    proxy: query.proxy,
    realIP: query.realIP,
    randomCNIP: process.env.ENABLE_RANDOM_CN_IP === 'true' ? (query.randomCNIP !== 'false' && query.randomCNIP !== false) : (query.randomCNIP === 'true' || query.randomCNIP === true),
    e_r: query.e_r || undefined,
    domain: query.domain || '',
    checkToken: query.checkToken || false,
  }
}
module.exports = createOption
