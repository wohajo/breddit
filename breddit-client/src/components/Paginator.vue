<template>
  <div class="paginator">
    <button @click="previousPage" class="btn btn-secondary">
      <BIconArrowLeftCircle /> Back
    </button>
    <span>{{ currentPage }} / {{ pageCount }}</span>
    <button @click="nextPage" class="btn btn-secondary pagination-button-right">
      Next <BIconArrowRightCircle />
    </button>
  </div>
</template>

<script>
import {
  BIconArrowRightCircle,
  BIconArrowLeftCircle,
} from "bootstrap-icons-vue";

export default {
  name: "Paginator",
  components: {
    BIconArrowRightCircle,
    BIconArrowLeftCircle,
  },
  props: {
    currentPage: Number,
    pageCount: Number,
  },
  methods: {
    previousPage() {
      if (this.currentPage > 1) {
        this.$emit("pageChanged", -1);
        window.scrollTo(0, 0);
      }
    },
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.$emit("pageChanged", 1);
        window.scrollTo(0, 0);
      }
    },
  },
};
</script>

<style lang="scss">
.pagination-button-right {
  float: right;
}

.paginator {
  span {
    font-size: larger;
  }
  display: flex;
  justify-content: space-between;
}
</style>
