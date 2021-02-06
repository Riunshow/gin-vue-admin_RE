module.exports = (file: string) => () => {
  return import('@/' + file)
}
