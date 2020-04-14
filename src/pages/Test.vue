<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Laravel Vue JS File Upload Example - ItSolutionStuff.com</div>

                    <div class="card-body">
                        <div v-if="success != ''" class="alert alert-success" role="alert">
                          {{success}}
                        </div>
                        <form @submit="formSubmit" enctype="multipart/form-data">
                          <strong>Name:</strong>
                          <input type="text" class="form-control" v-model="name">
                          <strong>File:</strong>
                          <input type="file" class="form-control" v-on:change="onFileChange">

                          <button class="btn btn-success">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const qs = (params) => Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
export default {
  mounted () {
    console.log('Component mounted.')
  },
  data () {
    return {
      name: '',
      file: '',
      success: ''
    }
  },
  methods: {
    onFileChange (e) {
      console.log(e)
      this.file = e.target.files[0]
    },
    formSubmit (e) {
      e.preventDefault()

      // const config = {
      //   headers: { 'content-type': 'multipart/form-data' }
      // }

      // let formData = new FormData()
      // formData.append('file', this.file)
      // formData.append('name', this.name)

      // let reader = new FileReader()
      // reader.onload = (e) => {
      //   this.file = e.target.result
      // } // reader.readAsDataURL(file)

      let formData = { name: this.name, file: this.file }
      // console.log(formData)
      console.log(this.name, this.file, 'formData = ', formData)

      this.$axios.put(`api/users/1?${qs(formData)}`).then(response => {
        this.success = response.data
      }).catch(error => {
        this.output = error
      })
    }
  }
}
</script>
