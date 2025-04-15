async function handler(req, res) {
  const response = await fetch("http://localhost:8000/")
  const data = await response.json()
  console.log(data)
  //res.json(data);
  res.json({
    gnssSatellites: data.gnssData || [],
    celestrakSatellites: data.celestrakData || []
  })
}

export default handler
