import axios from 'axios'

function removePhoto(photosContainer) {
  if (!photosContainer) return
//   console.log('Remove Photo func. Photos detected...')
//   console.table(photosContainer)

  photosContainer.childNodes.forEach(photoDiv => {
    const name = photoDiv.children[0].alt
    const deleteButton = photoDiv.children[1]

    deleteButton.on('click', function(e) {
      // console.log('delete photo button clicked...')
      e.preventDefault()
      e.stopPropagation()

      axios
        .post(`/remove/photo/${name}`)
        .then(res => {
          // console.log('Photo removed. Server sent back Result: ')
          // console.log(res.data)
          // remove the image containing div
          this.parentElement.remove()
          // remove the photos label and div if this was the last/only photo remaining
          if (!photosContainer.children.length) {
            photosContainer.classList.add('hidden')
            photosContainer.previousElementSibling.classList.add('hidden')
          }
      })
        .catch(err => {
          console.error(err)
        })
    })
  })
}

export default removePhoto