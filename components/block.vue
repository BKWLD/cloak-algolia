<!-- Renders a algolia block -->

<template lang='pug'>

section.algolia-block(:class='classes') Heya world

</template>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<script lang='coffee'>
export default

	props:

		# Combines horizontal padding and max-width rules
		maxWidth:
			type: String
			default: -> @$config.cloak?.algolia?.blockMaxWidth || ''

	computed:

		# Root classes
		classes: -> @maxWidth # Expect to match a CSS class

</script>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<style lang='stylus' scoped>

.algolia-block
	border 1px dashed currentColor
	padding 1em
	margin-v 1em

</style>
