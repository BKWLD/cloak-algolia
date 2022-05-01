###
Render the algolia block from Craft block data
###
export default
	functional: true
	props: block: Object
	render: (create, { props: { block }, data }) ->
		create 'cloak-algolia-block', {
			...data
			props: block
		}
