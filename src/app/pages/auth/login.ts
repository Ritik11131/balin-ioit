import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { UiService } from '../../layout/service/ui.service';
import { AuthService } from '../service/auth.service';
import { Store } from '@ngrx/store';
import { StoreService } from '../service/store.service';
import { WhitelabelThemeService } from '../service/whitelabel-theme.service';
import { CommonModule } from '@angular/common';
import { AppConfigurator } from "../../layout/component/app.configurator";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, CommonModule, AppConfigurator],
    template: `
    <app-configurator/>
            <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen dark:bg-gray-900 sm:p-0 lg:flex-row"
      >
        <!-- Form -->
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
         
          <div
            class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto"
          >
            <div>
              <div class="mb-5 sm:mb-8 flex justify-start items-center gap-3">
                <div>
                   @if (themeService.theme$ | async; as theme) {
                  <img [src]="theme.logo" alt="Login Logo" class="w-[45px] h-[45px]" />
              }
                </div>
                <div>
                  <h1
                    class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                  >
                    Sign In
                  </h1>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Enter your email and password to sign in!
                  </p>
                </div>
              </div>
              <div>
                <!-- <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                  <button
                    class="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                        fill="#EB4335"
                      />
                    </svg>
                    Sign in with Google
                  </button>
                </div> -->
                <!-- <div class="relative py-3 sm:py-5">
                  <div class="absolute inset-0 flex items-center">
                    <div
                      class="w-full border-t border-gray-200 dark:border-gray-800"
                    ></div>
                  </div>
                  <div class="relative flex justify-center text-sm">
                    <span
                      class="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2"
                      >Or</span
                    >
                  </div>
                </div> -->
                <form>
                  <div class="space-y-5">
                    <!-- Email -->
                    <div>
                      <label
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Email<span class="text-error-500">*</span>
                      </label>
                            <input name="email" pInputText id="email1" type="text" placeholder="Email address" class="w-full h-11" [(ngModel)]="email" />

                      <!-- <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="info@gmail.com"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      /> -->
                    </div>
                    <!-- Password -->
                    <div>
                      <label
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Password<span class="text-error-500">*</span>
                      </label>
                      <div class="relative">
                            <p-password name="password" id="password" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass=" h-11" [fluid]="true" [feedback]="false"></p-password>

                        <!-- <input
                          :type="showPassword ? 'text' : 'password'"
                          placeholder="Enter your password"
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        /> -->
                    
                      </div>
                    </div>
                    <!-- Checkbox -->
                    <div class="flex items-center justify-between">
                      <div x-data="{ checkboxToggle: false }">
                        <label
                          for="checkboxLabelOne"
                          class="flex items-center text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400"
                        >
                          <div class="relative">
                            <input
                              type="checkbox"
                              id="checkboxLabelOne"
                              class="sr-only"
                            />
                            <div
                              class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]"
                            >
                              <span :class="checkboxToggle ? '' : 'opacity-0'">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                    stroke="white"
                                    stroke-width="1.94437"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                          Keep me logged in
                        </label>
                      </div>
                      <a
                        href="/reset-password.html"
                        class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >Forgot password?</a
                      >
                    </div>
                    <!-- Button -->
                    <div>
                        <p-button label="Sign In" styleClass="w-full h-11" (onClick)="signIn()"></p-button>
                    </div>
                  </div>
                </form>
                <!-- <div class="mt-5">
                  <p
                    class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                  >
                    Don't have an account?
                    <a
                      href="/signup.html"
                      class="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >Sign Up</a
                    >
                  </p>
                </div> -->
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative items-center hidden w-full h-full bg-[var(--primary-color)] lg:grid lg:w-1/2"
        >
          
        </div>
      </div>
    </div>
    `
})
export class Login {
    email: string = 'balinadmin';
    password: string = 'Balin@123';
    checked: boolean = false;



    constructor(
        private uiService: UiService,
        private authService: AuthService,
        private router: Router,
        private store: Store,
        private storeService: StoreService,
        public themeService: WhitelabelThemeService
    ) {
      console.log(getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim());
      
     }

    async signIn(): Promise<any> {
        this.uiService.toggleLoader(true);
        try {
            await this.authService.login(this.email, this.password);
            this.store.dispatch({ type: '[Auth] Login Success' });
            this.router.navigate(['/home']);
            this.storeService.startAutoRefresh();
        } catch (error: any) {
            console.error(error);
            this.uiService.showToast('error', 'Error', 'Failed to logIN');
        } finally {
            this.uiService.toggleLoader(false);
        }
    }
}
