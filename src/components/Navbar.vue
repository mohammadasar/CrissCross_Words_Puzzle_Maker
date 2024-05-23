<template>
<div class="nav-container q-pa-md">
    <div class="navbar q-px-md">
        <q-toolbar class="bg-indigo-9 text-white shadow-12  rounded-borders nav-tool row" style="height: 70px;">
           <div class="col-6 q-pa-md" style="display: flex; align-items: center;column-gap: 30px;">
            <div class="">
            <img src="/game.png" style="width: 60px;height: 60px;">
           </div>
            <div class=" ">
                <q-toolbar-title  style="font-size: 30px; font-weight: 800;">
                    Daily Crossword
                </q-toolbar-title>
            </div>
           </div>
           
            <div class="btns q-pa-md col-6" align="end"   >
                <q-btn-dropdown label="Select Language" dropdown-icon="change_history" >
      <q-list>
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>English</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="ontamilClick">
          <q-item-section>
            <q-item-label>Tamil</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
            </div>
        </q-toolbar>

    </div>

</div>
</template>

<script>
export default{
    name:"Homepage",
    data(){
        return{

        }
    },
    methods:{
        onItemClick(){
            this.$router.push('/');
        },
        ontamilClick(){
            this.$router.push('/tamil');

        }

    }
}

</script>

<style>

</style>
