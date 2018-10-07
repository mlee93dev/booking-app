export class GoogleService {
  public LoadGoogleAPI(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    })
  }
}