const fetchAllStatus = async (url) => {
  const data = await fetch(`${url}`)
  const res = await data.json()
  return res
}

const fetchStatusById = async (url, id) => {
  const data = await fetch(`${url}/${id}`)
  const res = await data.json()
  return res
}

const deleteStatus = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: 'DELETE'
  })
  return res
}

const addStatus = async (url, newStatus) => {
  const res = await fetch(`${url}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: newStatus.name,
      description: newStatus.description,
      statusColor: newStatus.color
    })
  })
  return res
}

const updateStatus = async (url, id, updatedStatus) => {
  const res = await fetch(`${url}/${id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: updatedStatus.name,
      description: updatedStatus.description,
      statusColor: updatedStatus.color
    })
  })
  return res
}

export {
  fetchAllStatus,
  fetchStatusById,
  addStatus,
  updateStatus,
  deleteStatus
}
