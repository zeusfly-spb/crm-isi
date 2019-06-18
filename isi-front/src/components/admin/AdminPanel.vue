<template>
    <v-app>
        <v-tabs fixed-tab
                slider-color="red"
        >
            <v-tab
                v-for="item in sections"
                :key="item.id"
            >
                {{ item.label }}
            </v-tab>
            <v-tab-item
                v-for="item in sections"
                :key="item.id"
            >
                
            </v-tab-item>
        </v-tabs>
    </v-app>
</template>

<script>
    export default {
        name: 'AdminPanel',
        data: () => ({
            sections: [
                {id: 1, label: 'Сотрудники'},
                {id: 2, label: 'Группы'},
                {id: 3, label: 'Островки'},
                {id: 4, label: 'Доступы'},
            ],
            activeSection: 1
        })
    }
</script>
