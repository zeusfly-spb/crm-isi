<template>
    <div>
        <div v-for="phone in phones" :key="phone.id">
            {{ phone.number | phone}}
        </div>
    </div>
</template>
<script>
    export default {
        name: 'CustomerPhonesColumn',
        props: ['phones'],
        filters: {
            phone: function (val) {
                return '+7 ' + val.replace(/[^0-9]/g, '')
                    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
            }
        }
    }
</script>
