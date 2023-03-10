const InvariantError = require('../InvariantError')

describe('InvariantError', () => {
  it('Should create an error correctly', () => {
    const invariantError = new InvariantError('An error occurs')

    expect(invariantError.statusCode).toEqual(400)
    expect(invariantError.message).toEqual('An error occurs')
    expect(invariantError.name).toEqual('InvariantError')
  })
})
