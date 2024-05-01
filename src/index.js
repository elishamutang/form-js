import './styles.css'
import formValidation from './formValidation'
import buildingPic from '/assets/danist-soh-dqXiw7nCb9Q-unsplash.jpg'

// Append cover image
const imageTag = document.querySelector('img')
imageTag.src = buildingPic

// Form validation
formValidation()
