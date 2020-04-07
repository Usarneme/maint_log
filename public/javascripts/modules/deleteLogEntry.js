import axios from 'axios'

export default function deleteLogEntry(pathname) {
  // pathname will be "/log/some_log_ID/edit"
  const pathRegEx = /\/log\/.+\/edit/
  const logEntryId = window.location.pathname.split('/')[2]

  // only run this client JS on a log entry edit page
  if (!pathRegEx.test(window.location.pathname)) return

  console.log('DeleteLogEntry client js initialized...')
  const deleteButton = document.querySelector('.deleteLogEntry')
  const confirmDeleteButton = document.querySelector('.deleteLogEntryConfirm')

  deleteButton.addEventListener('click', event => {
    event.preventDefault()
    event.stopPropagation()

    if (confirmDeleteButton.classList.contains('hidden')) {
      confirmDeleteButton.classList.remove('hidden')
    } else {
      confirmDeleteButton.classList.add('hidden')
    }
  })

  confirmDeleteButton.addEventListener('click', event => {
    event.preventDefault()
    event.stopPropagation()

    deleteFromServer(logEntryId)
  })
}

function deleteFromServer(id) {
  axios
  .post(`/delete/log/entry/${id}`)
  .then(res => {
    if (res.data === null) {
      console.log('Server unable to find specified log entry. Was it already deleted?')
    } else if (res.status === 200) {
      console.log('Log entry removed. Server sent back Result: ')
      console.log(res)
      window.location.pathname = "/log"  
    }
  })
  .catch(err => {
    console.error(err)
  })
}
