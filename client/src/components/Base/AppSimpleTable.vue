<template>
  <div class="flex flex-col">
    <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div
          class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"
        >
          <table class="simple-table">
            <slot />
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
table.simple-table {
  @apply min-w-full divide-y divide-black/10 overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:divide-gray-600 dark:ring-gray-600 sm:rounded-lg;

  thead {
    @apply bg-gray-50 dark:bg-gray-700;

    tr {
      th {
        @apply px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white;
      }

      th.simple-table-actions {
        @apply relative py-3.5 pl-3 pr-4 sm:pr-6;
      }

      th:first-child {
        @apply py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6;
      }
    }
  }

  tbody {
    @apply divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800;

    tr {
      td {
        @apply whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300;
      }

      td.simple-table-actions {
        @apply relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6;
      }

      td:first-child {
        @apply whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6;
      }
    }
  }
}
</style>
