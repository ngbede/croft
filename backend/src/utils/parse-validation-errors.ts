import Joi from 'joi'

const parseErrors = (errorBody: Joi.ValidationError | undefined): string[] => {
  if (!errorBody) return [] // no errors

  const { details } = errorBody
  const errors = details.map((errs) => {
    return errs.message.replace('"', '').replace('"', '')
  })
  return errors
}

export default parseErrors
