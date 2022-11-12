
export default {
    template: `
            <form action="" class="flex">
                <div class="filter-input-container">
                    <label htmlFor="">Name</label>    
                    <input v-model="name" class="filter-text-input" type="text" placeholder="Book Name" />    
                </div>
                <div class="filter-input-container">
                    <label htmlFor="">Min Price</label>    
                    <input type="number" v-model="fromPrice" value="0"/>   
                </div>
                <div class="filter-input-container">
                    <label htmlFor="">Max Price</label>    
                    <input type="number" v-model="toPrice" value="1000"/>
                </div>
                <button @click.prevent="filter">Filter</button>
            </form>      
    `,
    data() {
        return {
            name: '',
            fromPrice: 0,
            toPrice: 1000,
        }
    },
    methods: {
        filter() {
            this.$emit('filtered', { name: this.name, fromPrice: this.fromPrice, toPrice: this.toPrice })
        }
    },
}
