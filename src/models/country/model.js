const mongoose = require('mongoose')
const CountrySchema = require('./schema')

// Get countries
CountrySchema.statics.findCountries = async () => {
  const countries = await Country
    .find({})
    .sort({ country: 1 })
    
  countries.some((item, idx) => item.country_iso === 'GB' && countries.unshift(countries.splice(idx,1)[0]))

  countries.splice(1, 0, {
    country: '-----------------------------'
  })
  
  return countries
}

const Country = mongoose.model('Country', CountrySchema)

module.exports = Country
