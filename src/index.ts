import { WillLauncher } from './WillLauncher'
const AUTO_LAUNCH_HASH = '#auto'

const launcher = new WillLauncher()
launcher.listenForDomEventsAndLaunchWills()
launcher.animate()

const autoLaunchElem = document.getElementById('auto-launch')

if (document.location.hash === AUTO_LAUNCH_HASH) {
  toggleAutoLaunch()
}

autoLaunchElem.addEventListener('click', e => {
  e.preventDefault()
  toggleAutoLaunch()
})

function toggleAutoLaunch () {
  launcher.toggleAutoLaunch()
  if (launcher.isAutoLaunching) {
    autoLaunchElem.innerText = 'stop automatically launching wills'
    document.location.hash = AUTO_LAUNCH_HASH
  } else {
    autoLaunchElem.innerText = 'start automatically launching wills'
    document.location.hash = ''
  }
}

// prevent touch scroll
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });
