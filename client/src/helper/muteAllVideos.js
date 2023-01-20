import $ from "jquery"
export default function muteAllVideos() {
    $('video').each(function (e) {
        this.muted = true
    })
}