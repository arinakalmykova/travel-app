<template>
  <client-only>
    <v-dialog v-model="showDialog">
      <v-card>
        <v-card-title>Новая точка</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="form.title"
              label="Название точки"
              required
            />
            <v-text-field
              v-model="form.description"
              label="Описание"
              required
            />
            <v-file-input
              label="Фото точки"
              accept="image/*"
              @change="onFileChange"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Отмена</v-btn>
          <v-btn @click="submit">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </client-only>
</template>


<script setup>
    import { ref, watch } from 'vue'
    import store from "../store/store"
    const props = defineProps({
        modelValue: Boolean,
        routeId: Number
    })

    const emit = defineEmits(['update:modelValue', 'saved'])

    const showDialog = ref(props.modelValue);

    watch(() => props.modelValue, val => showDialog.value = val);
    watch(showDialog, val => emit('update:modelValue', val));

    const form = ref({
        title: '',
        description: ''
    });

    const file = ref(null);

    const onFileChange = (e) => {
        file.value = e.target.files[0]
    };

    const closeDialog = () => {
        showDialog.value = false
    };

    const submit = async () => {
        if (!form.value.title || !form.value.description) {
            alert('Заполни все поля')
            return
        }

        const formData = new FormData()
        formData.append('title', form.value.title)
        formData.append('description', form.value.description)

        if (file.value) {
            formData.append('image', file.value)
        }

        await store.dispatch('addPoint', {
            routeId: props.routeId,
            formData
        });

        emit('saved')
        closeDialog()

        form.value.title = ''
        form.value.description = ''
        file.value = null
    }
</script>