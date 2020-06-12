import React from 'react'
import { Link, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment'
import { ReactSVG } from 'react-svg'

import PhotoEditor from '../components/PhotoEditor'
import EditPencil from '../images/editPencil.svg'

import '../styles/singleLogEntry.css'

function SingleLogEntry(props) {
  const { slug } = useParams()
  const log = props.user.log.filter(entry => entry.slug === slug)
  const { id, shortDescription, longDescription, dateStarted, dateCompleted, dateEntered, dateDue, mileageDue, name, odometer, tools, parts, partsCost, laborCost, serviceLocation, photos } = log[0]
  const vehicleID = log[0].vehicle
  const vehicleArray = props.user.vehicles.filter(_vehicle => _vehicle.id === vehicleID)
  const vehicle = vehicleArray[0]

  return (
    <div className="inner">
      <div className="card">
        <h2>{name.length > 120 ? `${name.substring(0,120)}...` : name}</h2>
        <div className="padded single__details">
          <div>
            <div>
              <strong>Service Performed: </strong>
              <span>{shortDescription}</span>
            </div>
            <div>
              <strong>Date Entered: </strong>
              <span>{moment(dateEntered).format("MMM Do YYYY")}</span>
            </div>
            <div>
              <strong>Vehicle: </strong>
              <span>{vehicle.year} {vehicle.make} {vehicle.model} {` at `} {odometer && Number(odometer).toLocaleString()} {` miles`}</span>
            </div>
          </div>
          <div>
            <strong>Long Description: </strong>
            <span>{longDescription}</span>
          </div>
          <div>
            <div>
              <strong>Started: </strong>
              <span>{moment(dateStarted).format("MMM Do YYYY")}</span>
            </div>
            <div>
              <strong>Completed: </strong>
              <span>{moment(dateCompleted).format("MMM Do YYYY")}</span>
            </div>
          </div>
          <div>
            {(mileageDue || dateDue) && 
            <>
              <strong>Service is Due Next: </strong>
              <span>{mileageDue > 0 ? `At ${Number(mileageDue).toLocaleString()} miles. ` : "[unset] miles. "} {dateDue && "On " && moment(dateDue).format("MMM Do YYYY")}</span>
            </>
            }
          </div>
          <div>
            <div>
              <strong>Tools: </strong>
              <span>{tools}</span>
            </div>
            <div>
              <strong>Parts: </strong>
              <span>{parts}</span>
            </div>
          </div>
          <div>
            <div>
              <strong>Parts Cost: </strong>
              <span>${partsCost && partsCost.toLocaleString()}</span>            
            </div>
            <div>
              <strong>Labor Cost: </strong>
              <span>${laborCost && laborCost.toLocaleString()}</span>
            
            </div>
          </div>
          <div>
            <strong>Service Location: </strong>
            <span>{serviceLocation}</span>
          </div>

          <Link className="button editPencil" to={`/log/${id}/edit`}>
            <ReactSVG src={EditPencil} role="img" aria-label="Edit Pencil Icon" fallback={() => <img src={EditPencil} alt="edit pencil icon" description="edit pencil icon" className="svg" />} /> 
            <h5>Edit</h5>
          </Link>

        { photos && photos.length > 0 && <PhotoEditor photos={photos} editingBlocked={true} /> }
        </div>
      </div>
    </div>
  )
}

SingleLogEntry.propTypes = {
  user: PropTypes.shape({
    cookies: PropTypes.string,
    email: PropTypes.string,
    log: PropTypes.array,
    name: PropTypes.string,
    sessionID: PropTypes.string,
    userID: PropTypes.string,
    vehicles: PropTypes.array,
    selectedVehicles: PropTypes.array
  }),
  updateUserState: PropTypes.func.isRequired
}

export default SingleLogEntry 