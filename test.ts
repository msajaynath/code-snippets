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
   @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    if (this.showDropdown && this.overlayRef) {
      this.positionDropdown();
    }
  }

  private positionDropdown() {
    const buttonRect = this.elRef.nativeElement.getBoundingClientRect();
    const top = buttonRect.bottom + 5; // 5 pixels below the button
    const left = buttonRect.left;

    if (this.lastPosition.top !== top || this.lastPosition.left !== left) {
      this.overlayRef.updatePosition({ top: top + 'px', left: left + 'px' });
      this.lastPosition = { top, left };
    }
  }
}
