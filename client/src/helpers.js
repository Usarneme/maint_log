import axios from 'axios'
axios.defaults.withCredentials = true

// Authenticates a user via email+password
// Upon success: returns a User object and 
// appends server session ID and cookie info to future requests
export async function login(email, password) {
  if (!email || !password) return new Error('No email or password provided to Login.')
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/login`, { email, password })
    if (response.status === 200) {
      const user = response.data
      user.userID = response.data._id
      // object property "primary" is a boolean indicating if it is the default/main vehicle to display
      const primaryVehicleArray = user.vehicles.filter(car => car.primary)
      if (primaryVehicleArray.length === 0) {
        user.selectedVehicles = [user.vehicles[0]] // if none is primary, display the first vehicle by default
      } else {
        user.selectedVehicles = primaryVehicleArray
      }
      return { user } 
    } else {
      console.log('Response received but with status code: '+response.status)
      const error = new Error(response.error)
      throw error
    }
  } 
  catch(loginError) {
    console.log(`Error posting to ${process.env.REACT_APP_API_DOMAIN}/api/login`)
    console.dir(loginError)
    return loginError
  }
}

// Register a new user account
// Returns user and session data (id, cookie) for a newly-created account
export async function register(name, email, password, passwordConfirm) {
  if (!name || !email || !password || !passwordConfirm) return new Error('Not all registration information provided. Please make sure you have entered a username, email address, password, and confirmed your password before trying again.')
  const url = `${process.env.REACT_APP_API_DOMAIN}/api/register`
  try {
    const response = await axios.post(url, { name, email, password, passwordConfirm })
    if (response.status === 200) {
      const user = response.data
      user.userID = response.data._id
      user.selectedVehicles = []
      user.vehicles = []
      user.log = []
      return { user }
    } else {
      console.log('Registration response received from the server but with an error and status code: '+response.status)
      const error = new Error(response.error)
      throw error
    }
  } 
  catch(registrationError) {
    console.log(`Error posting to ${process.env.REACT_APP_API_DOMAIN}/api/register`)
    console.log(registrationError.response.status)
    return registrationError
  }
}

// Gets all log and vehicle info for the logged-in user
// Returns a User's Log and Vehicle arrays
export async function getLogData() {
  // console.log('Getting new log data...')
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/log`)
    console.log('getLogData returned: ')
    console.dir(response)
    if (response.status === 200) return response.data
    // otherwise ERROR
    console.log('Response received but with status code: '+response.status)
    const error = new Error(response.error)
    throw error
  } catch (err) {
      console.log('Error getting data from /api/log/')
      console.dir(err)
      alert('Error getting log data please try again')
    }
}

// Save a new Vehicle and associate this with the logged-in user
// If successful, calls getLogData and returns the updated Log/Vehicle arrays
export async function addVehicle(vehicle) {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/vehicle/add`, vehicle)
    if (response.status === 200) return getLogData()
    console.log('Response received but with status code: '+response.status)
    const error = new Error(response.error)
    throw error
  } catch(err) {
    console.log('Error posting to /api/vehicle/add.')
    console.dir(err)
    // TODO error boundary - return false
    return alert('Error adding new vehicle. Please try again.')
  }
}

// saveVehicleChanges, post route = /api/vehicle
export async function updateVehicle(vehicle) {
  console.log("Updating an extant vehicle: ")
  console.dir(vehicle)
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/vehicle`, vehicle)
    if (response.status === 200) return getLogData()
    console.log('Response received but with status code: '+response.status)
    const error = new Error(response.error)
    throw error
  } catch(err) {
    console.log('Error posting to /api/vehicle.')
    console.dir(err)
    // TODO error boundary - return false
    return alert('Error updating vehicle. Please try again.')
  }
}

// Sends account changes (user name, email address, password) to the back end
// If successful, calls getLogData and returns the updated Log/Vehicle arrays
export async function updateUserAccount(userObject) {
  if (!userObject || Object.keys(userObject).length === 0) return null
  const { name, email } = userObject
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/account`, { name, email })
    if (response.status === 200) return getLogData()
    // otherwise ERROR
    console.log('Response received but with status code: '+response.status)
    const error = new Error(response.error)
    throw error
  } catch(err) {
      console.log('Error posting to /api/account.')
      console.dir(err)
      // TODO error boundary
      return alert('Error updating account. Please try again.')
    }
}

//
export const manufacturers = [
  "ACG",
  "Aston Martin",
  "Blue",
  "BMW",
  "Buell",
  "Bugatti",
  "Chevrolet",
  "Chrysler",
  "Coachworks",
  "Cooper",
  "Daimler",
  "E-One",
  "Fiat",
  "Ford",
  "GM",
  "Hino",
  "Hombilt",
  "Honda",
  "Hyundai",
  "International",
  "Jaguar",
  "Jialing",
  "Kenworth",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Latitude",
  "Lotus",
  "Mack",
  "Maserati",
  "Mazda",
  "Mercedes-Benz",
  "Mills",
  "Mitsubishi",
  "NABI",
  "Navistar",
  "Nissan",
  "NUMMI",
  "Optima",
  "Oshkosh",
  "Owosso",
  "PACCAR",
  "Peterbilt",
  "Peugot",
  "Quest",
  "Renault",
  "Rolls Royce",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo"
]

// BACKEND API-APP SHARED ROUTES
// POST
  // /add 
  // /add/:id 
  // /delete/log/entry/:id
  // /remove/photo/:filename 
  // /account/forgot 
  // /account/reset/:token 

// API ONLY ROUTES
// GET
  // /api/search       --> cleanly handled by SearchBox component
  // /api/log          --> not used anywhere... (login and account updates return {User+Vehicle})
// POST
  // /api/logout       --> DONE - Handled by Logout component
  // /api/login        --> DONE 
  // /api/register     --> DONE (TODO cleanup expectations of children wrt. new user flow i.e. need vehicle asap)
  // /api/vehicle/add  --> DONE (TODO error boundaries)
  // /api/vehicle      --> DONE (TODO error boundaries)
  // /api/account      --> DONE
