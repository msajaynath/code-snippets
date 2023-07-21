import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css'],
})
export class CustomDropdownComponent {
  options: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  filteredOptions: string[] = [];
  showDropdown = false;
  searchText = '';
  showSearchBar = false;

  constructor(private elRef: ElementRef) {}

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    this.showSearchBar = true;
    this.filteredOptions = this.options;
  }

  filterOptions() {
    if (this.searchText.trim() !== '') {
      this.filteredOptions = this.options.filter((option) =>
        option.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.showSearchBar = true;
    } else {
      this.filteredOptions = this.options;
      this.showSearchBar = false;
    }
  }

  selectOption(option: string) {
    this.searchText = option;
    this.showDropdown = false;
    this.showSearchBar = false;
  }

  stopClickPropagation(event: Event) {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: any) {
    const clickedInside = this.elRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.showDropdown = false;
      this.showSearchBar = false;
    }
  }
   @HostListener('scroll', ['$event.target'])
  onScroll(targetElement: any) {
    if (this.showDropdown && this.dropdownList.nativeElement) {
      const dropdownRect = this.dropdownList.nativeElement.getBoundingClientRect();
      const buttonRect = this.elRef.nativeElement.getBoundingClientRect();

      const top = buttonRect.bottom + 5; // 5 pixels below the button
      const left = buttonRect.left;

      if (
        dropdownRect.top !== top ||
        dropdownRect.left !== left ||
        dropdownRect.width !== buttonRect.width
      ) {
        this.dropdownList.nativeElement.style.top = top + 'px';
        this.dropdownList.nativeElement.style.left = left + 'px';
        this.dropdownList.nativeElement.style.width = buttonRect.width + 'px';
      }
    }
  }
}


export class CustomDropdownComponent {
  @Input() options: string[] = [];
  isOpen: boolean = false;
  parentScrollContainer: HTMLElement;

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    this.adjustDropdownPosition();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.adjustDropdownPosition();
  }

  selectOption(option: string) {
    console.log(`Selected option: ${option}`);
    this.isOpen = false;
  }

  setParentScrollContainer() {
    // Find the parent scroll container of the dropdown
    let parentElement = this.elRef.nativeElement.parentElement;
    while (parentElement && parentElement.tagName !== 'BODY') {
      const overflowY = window.getComputedStyle(parentElement).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') {
        this.parentScrollContainer = parentElement;
        return;
      }
      parentElement = parentElement.parentElement;
    }
  }

  adjustDropdownPosition() {
    if (this.isOpen) {
      if (!this.parentScrollContainer) {
        this.setParentScrollContainer();
      }

      if (this.parentScrollContainer) {
        const dropdownButton = this.elRef.nativeElement.querySelector('.dropdown-toggle');
        const dropdownMenu = this.elRef.nativeElement.querySelector('.dropdown-menu');
        const buttonRect = dropdownButton.getBoundingClientRect();

        const modalRect = this.parentScrollContainer.getBoundingClientRect();
        const scrollTop = this.parentScrollContainer.scrollTop;
        const offsetTop = buttonRect.top - modalRect.top + scrollTop;

        dropdownMenu.style.top = offsetTop + buttonRect.height + 'px';
        dropdownMenu.style.left = buttonRect.left + 'px';
      }
    }
  }
}
