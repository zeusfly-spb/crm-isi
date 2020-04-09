<template>
    <tr>
        <td
                colspan="6"
                align="right"
        >
            <span class="medium"><strong>ИТОГО:</strong></span>
        </td>
        <td>
            <span>
                {{ +`${totalDealIncome}` | pretty }}
            </span>
        </td>
        <td>
            <span class="subheading">{{ +`${totalDealExpense}` | pretty }}</span>
        </td>
    </tr>
</template>
<script>
    export default {
        name: 'DealsTableFooter',
        computed: {
            totalDealIncome () {
                return this.$store.getters.totalDealIncome
            },
            totalDealExpense () {
                return this.$store.getters.totalDealExpense
            }
        }
    }
</script>