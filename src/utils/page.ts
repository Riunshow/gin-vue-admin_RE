const title = 'GIN-VUE-ADMIN'

export default function getPageTitle (pageTitle: string) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
