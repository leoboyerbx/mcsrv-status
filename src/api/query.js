import axios from 'axios'

export default async function query() {
  const result = await axios.get('http://localhost:6754/query')
  return result.data
}
