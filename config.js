module.exports =  {
  prefix: '/',
  token: process.env.DISCORD_TOKEN,
  onlineChannelId: process.env.ONLINE_CHANNEL ?? '858126835459031061',
  webStatusUrl: process.env.WEB_STATUS_URL,
  webMapUrl: process.env.WEB_MAP_URL,
  queryHost: process.env.QUERY_HOST ?? 'localhost',
  queryPort: process.env.QUERY_PORT ?? 25565
}
