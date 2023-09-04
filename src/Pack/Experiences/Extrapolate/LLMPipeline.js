import { AutoTokenizer, AutoModelForSeq2SeqLM } from '@xenova/transformers'

class LLMPipeline {
	static model = '/Xenova/flan-t5-base'
	static params = {
		skip_special_tokens: true,
	}
	static instance = null

	static async getInstance() {
		if (this.instance === null) {
			let tokenizer = await AutoTokenizer.from_pretrained(this.model)
			let model = await AutoModelForSeq2SeqLM.from_pretrained(this.model)

			this.instance = async (sentence) => {
				let { input_ids } = await tokenizer(
					`What is the subject line for this email?\n\n${sentence}`
				)
				let outputs = await model.generate(input_ids)
				let out = ''
				outputs.forEach((_output, i) => {
					out += tokenizer.decode(outputs[i], this.params)
				})
				return out
			}
		}

		return this.instance
	}
}

export default LLMPipeline
