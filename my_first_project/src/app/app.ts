import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [RouterOutlet,FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
//   protected readonly title = signal('my_first_project');
//   name='';
//   isLoggedIn = true;
//   status = 'open';

//   tenders = [
//   { id: 1, title: 'Website Development' },
//   { id: 2, title: 'Mobile App Development' },
//   { id: 3, title: 'IT Support' }
// ];



  name = '';
  students = ['Rahim', 'Karim'];

  isEditing = false;   // edit cholche kina
  editIndex = 0;       // kon number edit hocche

  add() {
    this.students.push(this.name);
    this.name = '';
  }

  edit(i: number) {
    this.name = this.students[i];
    this.editIndex = i;
    this.isEditing = true;
  }

  update() {
    this.students[this.editIndex] = this.name;
    this.name = '';
    this.isEditing = false;
  }

  remove(i: number) {
    this.students.splice(i, 1);
  }

  show(i: number) {
    console.log('i-index =', i, ' name-value =', this.students[i]);
  }


}
