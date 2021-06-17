const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormButton = $messageForm.querySelector('button');
const $messageFormInput = $messageForm.querySelector('input');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });


const autoscroll = () => {
    const $newMessage = $messages.lastElementChild;

    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = $messages.offsetHeight;

    const containerHeight = $messages.scrollHeight;

    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
     }

}


    socket.on('message', (message) => {
        const html = Mustache.render(messageTemplate, {
            username: message.username,
            message: message.text,
            createdAt: moment(message.createdAt).format('h:mm a')
        });

        $messages.insertAdjacentHTML('beforeend', html);
        autoscroll();
    })


    socket.on('locationMessage', (message) => {
        const html = Mustache.render(locationTemplate, {
            username: message.username,
            locationURL: message.url,
            createdAt: moment(message.createdAt).format('h:mm a')
        });

        $messages.insertAdjacentHTML('beforeend', html);
        autoscroll();
    })

    socket.on(`roomData`, ({ room, users }) => {
        const html = Mustache.render(sidebarTemplate, {
            room,
            users
        });

        document.querySelector('#sidebar').innerHTML = html;
    })




    $messageForm.addEventListener('submit', (event) => {
        event.preventDefault();

        $messageFormButton.setAttribute('disabled', 'disabled');

        const message = event.target.elements.message.value;
        socket.emit('sendMessage', message, (error) => {
            $messageFormButton.removeAttribute('disabled');
            $messageFormInput.value = '';
            $messageFormInput.focus();

            if (error) {
                return console.log(error);
            }
            console.log('Message sent successfully');
        });
    })

    $sendLocationButton.addEventListener('click', () => {
        if (!navigator.geolocation) {
            return alert('Geolocation is not supported on your device');
        }
        $sendLocationButton.setAttribute('disabled', 'disabled');

        navigator.geolocation.getCurrentPosition((position) => {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            socket.emit('sendLocation', location, () => {
                $sendLocationButton.removeAttribute('disabled');
                console.log('Location Shared');
            });
        })
    });

    socket.emit('join', { username, room }, (error) => {
        if (error) {
            alert(error)
            location.href = "/"
        }
    });

