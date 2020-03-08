import axios from 'axios'

function removePhoto(photosContainer) {
  if (!photosContainer) return
//   console.log('Remove Photo func. Photos detected...')
//   console.table(photosContainer)

  photosContainer.childNodes.forEach(photoDiv => {
    const name = photoDiv.children[0].alt
    const deleteButton = photoDiv.children[1]
    deleteButton.addEventListener('click', function(e) {
      confirmDelete(e, name, photosContainer, photoDiv)
    })
  })
}

function confirmDelete(e, name, photosContainer, photoDiv) {
  e.preventDefault()
  e.stopPropagation()

  // TODO - pass a double check modal
  deletePhoto(name, photosContainer, photoDiv)
}

function deletePhoto(name, photosContainer, photoDiv) {
  // console.log(photoDiv, name)

  axios
  .post(`/remove/photo/${name}`)
  .then(res => {
    // console.log('Photo removed. Server sent back Result: ')
    // console.log(res.data)
    // remove the image containing div
    photoDiv.remove()
    // hide both the photos div and label if this was the last/only photo remaining
    if (!photosContainer.children.length) {
      photosContainer.classList.add('hidden')
      photosContainer.previousElementSibling.classList.add('hidden')
    }
  })
  .catch(err => {
    console.error(err)
  })
}

export default removePhoto