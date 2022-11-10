export default {
    template: `
    <input v-model="filterBy.txt" @input="filter" type="text" placeholder="filter"/>
    `,
    data() {
        return {
            filterBy: {
                txt: '',
            }
        }
    },methods: {
        filter(){
            this.filterBy.txt = this.filterBy.txt.toLowerCase()
            this.$emit('notes-filtered',this.filterBy)
        }
    },
}