import { defu } from 'defu'

// This syncs entries to Algolia during SSG, including removing old records.
export default function() {

	// Don't run on deploy previews so WIP changes don't corrupt the prod
	// indices
	if (process.env.NETLIFY && process.env.CONTEXT !== 'production') return

	// Run syncing before generation so collections are SSGed with accurate data
	return this.nuxt.hook('generate:before', () => {
		startRecordSync(this.options.cloak && this.options.cloak.algolia)
	})
}

// The main entry point of the sync logic which does the options parsing before
// actually running the sync.
export async function startRecordSync(config = {}) {
	console.log(config)
	console.log(defu({
		size: 'custom',
		make: {
			year: 1920,
		},
		ar: ['pants'],
	}, {
		size: 'default',
		make: {
			car: 'suburu',
		},
		ar: [
			'studly'
		],
	}))
}

// Do the work of converting entries to records
export async function syncIndices() {

	console.log('start')

	await new Promise((resolve) => {
		setTimeout(resolve, 1000)
	})

	console.log('done')

	// Make the list of indices to create and loop through them
	// const indexHandles = await getIndexHandles()

	// // for (let i = 0; i < indexHandles.length; i++) {

	// // }

	// for await (const indexHandle of indexHandles) {
	// 	try {
	// 		results.push((await syncIndex(indexHandle)));
	// 	} catch (error) {
	// 		log(`Sync error on ${indexHandle}`);
	// 		console.error(error)
	// 	}
	// }

	// for (i = 0, len = indexHandles.length; i < len; i++) {
	// 	indexHandle = indexHandles[i];
	// 	try {
	// 		// Sync the the index
	// 		results.push((await syncIndex(indexHandle)));
	// 	} catch (error1) {
	// 		error = error1;
	// 		log(`Sync error on ${indexHandle}`);
	// 		results.push(console.error(error));
	// 	}
	// }
	// return results;
};
