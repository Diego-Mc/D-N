export default {
    props: ['media'],
    template: `
            <div id="map" :ref="id" style="width:100%;height:200px">
            </div>
    `,
    data() {
        return {
            map: null,
            id: 'm' + Math.round(Math.random() * 1000)
        }
    },
    mounted() {
        this.onInit()
    },
    methods: {
        initMap(lat = 32.0749831, lng = 34.9120554) {
            this.map = new google.maps.Map(
                this.$refs[this.id], {
                center: { lat, lng },
                disableDefaultUI: true,
                zoom: 15
            })
            return this.map
        },

        onInit() {
            this.initMap(this.media.lat, this.media.lng)
            this.addMarker()

        },
        addMarker(name = 'I was here!', pos = { lat: this.media.lat, lng: this.media.lng }, id) {
            var marker = new google.maps.Marker({
                id,
                position: pos,
                map: this.map,
                title: name
            })
        }
    }, computed: {
        getMedia() {
            return this.media
        }
    }

}