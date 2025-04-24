export interface IDatabaseRepository {
  onInit(): Promise<void>
  onStop(): Promise<void>
}
