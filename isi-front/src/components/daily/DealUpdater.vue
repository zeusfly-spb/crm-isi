<template>
    <v-flex>
        <span v-if="!active"
              :class="{clickable: canUpdate}"
              @click="activate"
              :title="canUpdate ? 'Клик чтобы изменить продукцию по сделке' : ''"
        >
            {{ deal.insole.name }}
        </span>
        <v-dialog
            v-model="active"
            persistent
            max-width="600px"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">Изменить продукцию по сделке</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md4>
                                <sub>Продукция</sub>
                                <v-select
                                    v-model="deal.product_id"
                                    :items="stockOptions.products"
                                    item-text="name"
                                    item-value="id"
                                    single-line
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <sub>Материал</sub>
                                <v-select
                                    v-model="deal.type_id"
                                    :items="stockOptions.types"
                                    item-text="name"
                                    item-value="id"
                                    single-line
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <sub>Размер</sub>
                                <v-select
                                    v-model="deal.size_id"
                                    :items="formattedSizes"
                                    item-text="name"
                                    item-value="id"
                                    single-line
                                    data-vv-as="Размер"
                                    data-vv-name="size"
                                    :error-messages="errors.collect('size')"
                                    v-validate="'required'"
                                />
                            </v-flex>

                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="deactivate">Закрыть</v-btn>
                    <v-btn color="green darken-1" flat @click="">Сохранить</v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
    </v-flex>
</template>
<script>
    export default {
        name: 'DealUpdater',
        props: ['deal'],
        data: () => ({
            active: false
        }),
        computed: {
            currentReserves () {
                return this.$store.getters.currentReserves
            },
            newDealSizes () {
                let currentProduct = this.stockOptions.products && this.stockOptions.products.find(product => +product.id === +this.deal.product_id) || {name: 'Стельки'}
                console.dir(currentProduct)
                return currentProduct.name === 'Стельки' ? this.$store.state.stock.options.sizes :
                    this.$store.state.stock.options.sizes.filter(size => !['29-30', '30-31.5', '32-33', '34-34.5', '46-46.5', '47'].includes(size.name))
            },
            formattedSizes () {
                let currentAction = this.stockOptions.deal_actions &&
                    this.stockOptions.deal_actions.find(item => +item.id === +this.deal.deal_action_id) &&
                    this.stockOptions.deal_actions.find(item => +item.id === +this.deal.deal_action_id).type || null
                let productName = this.stockOptions.products &&
                    this.stockOptions.products.find(item => +item.id === +this.deal.product_id) &&
                    this.stockOptions.products.find(item => +item.id === +this.deal.product_id).name || null
                let typeName = this.stockOptions.types &&
                    this.stockOptions.types.find(item => +item.id === +this.deal.type_id) &&
                    this.stockOptions.types.find(item => +item.id === +this.deal.type_id).name || null
                return currentAction === 'produce' ? this.newDealSizes &&
                    this.newDealSizes.map(item => this.currentCount(productName, typeName, item.id) > 0 ? item : ({...item, disabled: true})) : this.newDealSizes
            },
            stockOptions () {
                return this.$store.state.stock.options
            },
            isToday () {
                return this.$store.state.accountingDate === this.realDate
            },
            realDate () {
                return this.$store.state.realDate
            },
            canUpdate () {
                return !this.isToday ? false : this.isSuperadmin ? true :  this.deal.user_id === this.authUser.id
            },
            basePath () {
                return this.$store.state.basePath
            },
            authUser () {
                return this.$store.state.authUser
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            }
        },
        methods: {
            currentCount (productName, typeName, sizeId) {
                let target = this.currentReserves.find(reserve => reserve.size_id === sizeId && reserve.product.name === productName && reserve.type.name === typeName)
                return target && target.count || 0
            },
            deactivate () {
                this.active = false
            },
            activate () {
                if (!this.canUpdate) return

                this.active = true
            }
        },
        watch: {
            active (value) {
                if (value) {
                    this.$emit('activated')
                }  else {
                    this.$emit('deactivated')
                }
            }
        }
    }
</script>
<style scoped>
    .clickable {
        cursor: pointer;
    }
</style>
