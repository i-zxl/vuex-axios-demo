<style lang="stylus">
	.body
		color red
		text-align center
		font-size 22px
</style>

<template lang="pug">
	div
		h1.title {{title}}
		.body
			span {{msg}}
			span {{user}}
		.footer
</template>

<script>
	import { getDate } from 'src/util'
	import { mapGetters, mapActions } from 'vuex'
  export default {
    data () {
      return {
				title: 'Hello',
				body: '',
				msg: '',
				param: {
					id: 12
				}
      }
    },
		computed: mapGetters({
			user: 'getUser'
		}),

		mounted () {
			this.msg = `This is es6App ${getDate()}`;
			this.$store.dispatch('request_user', this.param);
		}
  }
</script>
