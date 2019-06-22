import { WillLauncher } from './WillLauncher'

const launcher = new WillLauncher()
launcher.listenForDomEventsAndLaunchWills()
launcher.animate()

const autoLaunchElem = document.getElementById('auto-launch')

autoLaunchElem.addEventListener('mousedown', e => {
  e.preventDefault()
  launcher.toggleAutoLaunch()
  if (launcher.isAutoLaunching) {
    autoLaunchElem.innerText = 'stop automatically launching wills'
  } else {
    autoLaunchElem.innerText = 'start automatically launching wills'
  }
})
