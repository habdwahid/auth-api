const RegisteredUser = require('../RegisteredUser')

describe('A RegisteredUser entities', () => {
  it('Should throw error when payload did not contain neede property', () => {
    const payload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    }

    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('Should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    }

    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('Should throw create registeredUser object correctly', () => {
    const payload = {
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    }

    const registeredUser = new RegisteredUser(payload)

    expect(registeredUser.id).toEqual(payload.id)
    expect(registeredUser.username).toEqual(payload.username)
    expect(registeredUser.fullname).toEqual(payload.fullname)
  })
})
