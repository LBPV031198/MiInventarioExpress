import { ref, type Ref } from 'vue';

export function useContador(): { contador: Ref<number>, incrementar: () => void } {
  const contador = ref(0);

  const incrementar = () => {
    contador.value++;
  };

  return { contador, incrementar };
}
