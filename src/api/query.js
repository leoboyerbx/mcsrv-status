import axios from 'axios'

const apiUrl = import.meta.env.PROD ? '/query' : 'http://localhost:6754/query'

export default async function query() {
  const result = await axios.get(apiUrl)
  return result.data
}
