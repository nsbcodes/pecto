import { env, AutoTokenizer, AutoModelForSeq2SeqLM } from '@xenova/transformers'

env.allowRemoteModels = false

class LLMPipeline {
	static model = 'flan-t5-termdef'
	static params = {
		max_length: 20,
		no_repeat_ngram_size: 1,
		do_sample: true,
		top_k: 50,
		top_p: 0.95,
		temperature: 0.9,
		num_return_sequences: 1,
		repetition_penalty: 1.3,
	}
	static instance = null

	static async getInstance() {
		if (this.instance === null) {
			let tokenizer = await AutoTokenizer.from_pretrained(this.model)
			let model = await AutoModelForSeq2SeqLM.from_pretrained(this.model)

			this.instance = async (definition) => {
				let { input_ids } = await tokenizer(
					`What is the subject line for this email?\n\n${definition}`
				)
				let outputs = await model.generate(input_ids)
				console.log(outputs)
				return tokenizer.decode(outputs[0], this.params)
			}
		}

		return this.instance
	}
}

export default LLMPipeline
